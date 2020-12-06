package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/heroku/x/hmetrics/onload"
	_ "github.com/lib/pq"
	internalData "github.com/philLITERALLY/wodland-service/internal/data"
	internalDB "github.com/philLITERALLY/wodland-service/internal/data/db"
	internalHTTP "github.com/philLITERALLY/wodland-service/internal/http"
)

var (
	idKey       = "id"
	usernameKey = "username"
	roleKey     = "role"
)

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}

func main() {
	// Set up heroku database connection
	dataSource, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Error opening database: %q", err)
	}

	router := gin.Default()
	router.Use(corsMiddleware())
	router.Use(gin.Logger())

	maxTimeout := time.Until(time.Date(2030, 0, 0, 0, 0, 0, 0, time.UTC))

	// The jwt middleware
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "test zone",
		Key:         []byte("secret key"),
		Timeout:     maxTimeout,
		MaxRefresh:  maxTimeout,
		IdentityKey: usernameKey,
		PayloadFunc: func(dataInterface interface{}) jwt.MapClaims {
			if v, ok := dataInterface.(*internalData.User); ok {
				return jwt.MapClaims{
					idKey:       v.ID,
					usernameKey: v.Username,
					roleKey:     v.Role,
				}
			}
			return jwt.MapClaims{}
		},
		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)
			return &internalData.User{
				ID:       int(claims[idKey].(float64)),
				Username: claims[usernameKey].(string),
				Role:     claims[roleKey].(string),
			}
		},
		Authenticator: func(c *gin.Context) (interface{}, error) {
			var loginVals internalData.Login
			if err := c.ShouldBind(&loginVals); err != nil {
				return "", jwt.ErrMissingLoginValues
			}

			// Fetch login user
			user, err := internalDB.GetUser(dataSource, loginVals)
			if err != nil {
				fmt.Printf("fetching user err: %v \n", err)
				return nil, jwt.ErrFailedAuthentication
			}

			return &user, nil
		},
		Authorizator: func(dataInterface interface{}, c *gin.Context) bool {
			if _, ok := dataInterface.(*internalData.User); ok {
				return true
			}

			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		},
		TokenLookup:   "header: Authorization, query: token, cookie: jwt",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	})

	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}

	errInit := authMiddleware.MiddlewareInit()
	if errInit != nil {
		log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
	}

	// Serving static content from web - we will populate this from within the docker container
	fmt.Printf("local?! %v\n", static.LocalFile("./web", true))
	fmt.Printf("service-worker?! %v\n", static.LocalFile("./service-worker.js", true))
	router.Use(static.Serve("/", static.LocalFile("./web", true)))
	router.Use(static.Serve("/login", static.LocalFile("./web", true)))
	router.Use(static.Serve("/diary", static.LocalFile("./web", true)))
	router.Use(static.Serve("/add-wod", static.LocalFile("./web", true)))
	router.Use(static.Serve("/search-wods", static.LocalFile("./web", true)))
	router.Use(static.Serve("/service-worker", static.LocalFile("./service-worker.js", true)))
	router.Use(static.Serve("/service-worker.js", static.LocalFile("./service-worker.js", true)))

	// Set up /api endpoint group
	api := router.Group("/api")
	{
		// Auth endpoints
		api.POST("/login", authMiddleware.LoginHandler)
		api.POST("/logout", authMiddleware.LogoutHandler)
		api.GET("/refresh_token", authMiddleware.RefreshHandler)

		// Endpoint to get stats for every week
		api.GET("/WeeklyStats", authMiddleware.MiddlewareFunc(), internalHTTP.GetWeeklyStats(dataSource))

		// Endpoint to get WODs (can be filtered)
		api.GET("/WODs", authMiddleware.MiddlewareFunc(), internalHTTP.GetWODs(dataSource))

		// Endpoint to get WODs (can be filtered)
		api.GET("/Activities", authMiddleware.MiddlewareFunc(), internalHTTP.GetActivities(dataSource))

		// Endpoint to create a WOD (and add an attempt if supplied)
		api.POST("/WOD", authMiddleware.MiddlewareFunc(), internalHTTP.AddWOD(dataSource))

		// Endpoint to add an Activity
		api.POST("/Activity", authMiddleware.MiddlewareFunc(), internalHTTP.AddActivity(dataSource))
	}

	router.Run()
}
