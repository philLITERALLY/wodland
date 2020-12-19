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

// GetActivitiesForWODIDs will get and return activities for given WOD IDs
func GetActivitiesForWODIDs(dataSource *sql.DB, userID int, wodIDs []int) (map[int][]data.Activity, error) {
	activityQuery := psql.
		Select(activityColumns...).
		From("activity").
		Where(sq.Eq{"activity.user_id": userID}).
		Where(sq.Eq{"activity.wod_id": wodIDs})
	sqlActivityQuery, activityArgs, _ := activityQuery.ToSql()

	activityRows, activityErr := dataSource.Query(sqlActivityQuery, activityArgs...)
	if activityErr != nil {
		fmt.Errorf("activity db err: %v", activityErr)
		return nil, activityErr
	}

	var wodActivities = make(map[int][]data.Activity)
	defer activityRows.Close()
	for activityRows.Next() {
		var activity data.Activity

		if err := activityRows.Scan(&activity.ID, &activity.WODID, &activity.Date, &activity.TimeTaken, &activity.MEPs, &activity.Exertion, &activity.Notes, &activity.Score); err != nil {
			fmt.Errorf("activity scan err: %v", err)
			return nil, err
		}

		// if we've already got an array of activities for the current WOD append to it
		// and don't store duplicate wod
		// else create the array of activities and store wod
		if activities, ok := wodActivities[*activity.WODID]; ok {
			wodActivities[*activity.WODID] = append(activities, activity)
		} else {
			wodActivities[*activity.WODID] = []data.Activity{activity}
		}
	}

	return wodActivities, nil
}

// GetActivities will get and return Activities
func GetActivities(dataSource *sql.DB, filters *data.ActivityFilter, userID int) ([]data.Activity, error) {
	var wodIDs = []int{}
	var dbActivities = []data.Activity{}

	selectQuery := psql.
		Select(activitiesColumns...).
		From("activity").
		Join("wod ON wod.id = activity.wod_id AND activity.user_id = ?", userID)

	selectQuery = processActivityFilters(selectQuery, filters)
	sqlQuery, args, _ := selectQuery.ToSql()

	rows, err := dataSource.Query(sqlQuery, args...)
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

		wodIDs = append(wodIDs, wod.ID)
		activity.WOD = &wod
		dbActivities = append(dbActivities, activity)
	}

	wodActivities, err := GetActivitiesForWODIDs(dataSource, userID, wodIDs)
	if err != nil {
		return nil, err
	}

	// loop through stored activities and add any previous activities for the wod
	for index, activity := range dbActivities {
		if activities, ok := wodActivities[activity.WOD.ID]; ok {
			activity.WOD.Activities = &activities
			dbActivities[index] = activity
		}
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
