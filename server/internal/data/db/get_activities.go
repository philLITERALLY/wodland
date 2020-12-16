package db

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	_ "github.com/heroku/x/hmetrics/onload"
	"github.com/lib/pq"
	"github.com/philLITERALLY/wodland-service/internal/data"
)

var activitiesColumns = []string{
	"activity.id",
	"activity.date",
	"activity.time_taken",
	"activity.score",
	"activity.meps",
	"activity.exertion",
	"activity.notes",
	"wod.id",
	"wod.source",
	"wod.creation_t",
	"wod.wod",
	"wod.picture",
	"wod.type",
	"wod.created_by",
}

// GetActivities will get and return Activities
func GetActivities(db *sql.DB, filters *data.ActivityFilter, userID int) ([]data.Activity, error) {
	var dbActivities = []data.Activity{}

	selectQuery := psql.
		Select(activitiesColumns...).
		From("activity").
		Join("wod ON wod.id = activity.wod_id AND activity.user_id = ?", userID)

	selectQuery = processActivityFilters(selectQuery, filters)
	sqlQuery, args, _ := selectQuery.ToSql()

	rows, err := db.Query(sqlQuery, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	for rows.Next() {
		var activity data.Activity
		var wod data.WOD

		if err := rows.Scan(
			&activity.ID, &activity.Date, &activity.TimeTaken, &activity.Score, &activity.MEPs, &activity.Exertion, &activity.Notes,
			&wod.ID, &wod.Source, &wod.CreationT, &wod.Exercise, &wod.Picture, pq.Array(&wod.Type), &wod.CreatedBy,
		); err != nil {
			fmt.Errorf("activities err: %v \n", err)
			return nil, err
		}

		activity.WOD = &wod
		dbActivities = append(dbActivities, activity)
	}

	return dbActivities, nil
}

func processActivityFilters(baseQuery sq.SelectBuilder, filters *data.ActivityFilter) sq.SelectBuilder {
	baseQuery = processActivityDateFilter(baseQuery, filters)

	return baseQuery
}

func processActivityDateFilter(baseQuery sq.SelectBuilder, filters *data.ActivityFilter) sq.SelectBuilder {
	if !filters.StartDate.IsZero() {
		baseQuery = baseQuery.Where("date >= ?", float64(filters.StartDate.Unix()))
	}

	if !filters.EndDate.IsZero() {
		baseQuery = baseQuery.Where("date <= ?", float64(filters.EndDate.Unix()))
	}

	return baseQuery
}
