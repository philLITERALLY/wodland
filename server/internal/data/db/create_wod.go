package db

import (
	"database/sql"
	"fmt"

	_ "github.com/heroku/x/hmetrics/onload"
	"github.com/philLITERALLY/wodland-service/internal/data"
)

// CreateWOD will create a WOD (and add an activity if supplied)
func CreateWOD(dataSource *sql.DB, WOD data.CreateWOD, userID int) error {
	typeStr := fmt.Sprintf("{%s}", WOD.Type[0])
	wodQuery := psql.
		Insert("wod").
		Columns("source, creation_t, wod, picture, type, created_by").
		Values(WOD.Source, WOD.CreationT, WOD.Exercise, WOD.Picture, typeStr, userID).
		Suffix("RETURNING \"id\"")
	sqlWODQuery, wodArgs, _ := wodQuery.ToSql()

	var wodID int
	wodErr := dataSource.QueryRow(sqlWODQuery, wodArgs...).Scan(&wodID)
	if wodErr != nil {
		return wodErr
	}

	if WOD.ActivityInput != nil {
		activity := WOD.ActivityInput
		activity.WODID = &wodID

		activityErr := CreateActivity(dataSource, *activity, userID)
		if activityErr != nil {
			return activityErr
		}
	}

	return nil
}
