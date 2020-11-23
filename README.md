# WODLand using React, Go, Heroku
Use a single Dockerfile to spin up a ReactJS client, and a Go server.  

## Objective
- Go + React Web Application
- Using Docker to spin up instance
- Publish Web Application to Heroku

## Usage
```
# create the image
docker build -t golang-heroku .

# run a container
docker run --detach --name full-stack -p 3000:8080 -d golang-heroku

# remove container
docker container stop full-stack
docker container rm full-stack

# delete the image
docker rmi golang-heroku
```

## References
Guides used

- https://levelup.gitconnected.com/deploying-go-react-to-heroku-using-docker-9844bf075228
- https://medium.com/@deano.baker/deploying-go-react-to-heroku-using-docker-part-2-the-database-afaaaae66f81
- https://github.com/deandemo/react-go-heroku

Similar Projects
- https://github.com/muryakami/go-react
- https://github.com/ogryzek/react-go-docker