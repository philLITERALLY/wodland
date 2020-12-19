package db

import (
	"database/sql"

	_ "github.com/heroku/x/hmetrics/onload"
	"github.com/philLITERALLY/wodland-service/internal/data"
)

// CreateActivity will create an Activity
func CreateActivity(dataSource *sql.DB, activity data.ActivityInput, userID int) error {
	activityQuery := psql.
		Insert("activity").
		Columns("user_id, wod_id, date, time_taken, meps, exertion, notes, score").
		Values(userID, activity.WODID, activity.Date, activity.TimeTaken, activity.MEPs, activity.Exertion, activity.Notes, activity.Score)
	sqlActivityQuery, args, _ := activityQuery.ToSql()

	_, err := dataSource.Exec(sqlActivityQuery, args...)
	if err != nil {
		return err
	}

	return nil
}
