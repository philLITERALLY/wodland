package db

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"

	_ "github.com/heroku/x/hmetrics/onload"
	"github.com/lib/pq"
	"github.com/philLITERALLY/wodland-service/internal/data"
)

var psql = sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
var wodColumns = []string{
	"wod.id",
	"wod.source",
	"wod.creation_t",
	"wod.wod",
	"wod.picture",
	"wod.type",
	"wod.created_by",
}

var activityColumns = []string{
	"activity.id",
	"activity.wod_id",
	"activity.date",
	"activity.time_taken",
	"activity.meps",
	"activity.exertion",
	"activity.notes",
	"activity.score",
}

// GetWODs will get and return WODs
func GetWODs(db *sql.DB, filters *data.WODFilter, userID int) ([]data.WOD, error) {
	var wodIDs = []int{}
	var dbWODs = []data.WOD{}

	wodsQuery := psql.
		Select(wodColumns...).
		From("wod").
		LeftJoin("activity ON activity.wod_id = wod.id AND activity.user_id = ?", userID).
		GroupBy("wod.id").
		OrderBy("random()")

	wodsQuery = processWODFilters(wodsQuery, filters)
	wodsQuery = wodsQuery.Limit(10)
	sqlWodsQuery, wodsArgs, _ := wodsQuery.ToSql()

	wodsRows, wodsErr := db.Query(sqlWodsQuery, wodsArgs...)
	if wodsErr != nil {
		fmt.Errorf("wods db err: %v", wodsErr)
		return nil, wodsErr
	}

	defer wodsRows.Close()
	for wodsRows.Next() {
		var wod data.WOD

		if err := wodsRows.Scan(
			&wod.ID, &wod.Source, &wod.CreationT, &wod.Exercise, &wod.Picture, pq.Array(&wod.Type), &wod.CreatedBy,
		); err != nil {
			fmt.Errorf("wods scan err: %v", err)
			return nil, err
		}

		wodIDs = append(wodIDs, wod.ID)
		dbWODs = append(dbWODs, wod)
	}

	activityQuery := psql.
		Select(activityColumns...).
		From("activity").
		Where(sq.Eq{"activity.user_id": userID}).
		Where(sq.Eq{"activity.wod_id": wodIDs})
	sqlActivityQuery, activityArgs, _ := activityQuery.ToSql()

	activityRows, activityErr := db.Query(sqlActivityQuery, activityArgs...)
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

	// loop through stored wods and add any associated activities
	for index, wod := range dbWODs {
		if activities, ok := wodActivities[wod.ID]; ok {
			wod.Activities = &activities
			dbWODs[index] = wod
		}
	}

	return dbWODs, nil
}

func processWODFilters(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	baseQuery = processWODIDFilter(baseQuery, filters)
	baseQuery = processSourceFilter(baseQuery, filters)
	baseQuery = processWODDateFilter(baseQuery, filters)
	baseQuery = processExerciseFilter(baseQuery, filters)
	baseQuery = processPictureFilter(baseQuery, filters)
	baseQuery = processTypeFilter(baseQuery, filters)
	baseQuery = processTriedFilter(baseQuery, filters)
	baseQuery = processBestTimeFilter(baseQuery, filters)
	baseQuery = processBestScoreFilter(baseQuery, filters)
	baseQuery = processBestMEPSFilter(baseQuery, filters)
	baseQuery = processBestExertionFilter(baseQuery, filters)

	return baseQuery
}

func processWODIDFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if filters.WODID != nil {
		baseQuery = baseQuery.Where(sq.Eq{"wod.id": filters.WODID})
	}

	return baseQuery
}

func processSourceFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if len(filters.Source) > 0 {
		baseQuery = baseQuery.Where(sq.Expr("LOWER(wod.source) LIKE LOWER(?)", fmt.Sprint("%", filters.Source, "%")))
	}

	return baseQuery
}

func processWODDateFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if !filters.StartDate.IsZero() {
		baseQuery = baseQuery.Where("wod.creation_t >= ?", float64(filters.StartDate.Unix()))
	}

	if !filters.EndDate.IsZero() {
		baseQuery = baseQuery.Where("wod.creation_t <= ?", float64(filters.EndDate.Unix()))
	}

	return baseQuery
}

func processExerciseFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if len(filters.IncludeExercise) > 0 {
		clause := sq.And{}
		for _, exercise := range filters.IncludeExercise {
			clause = append(clause, sq.Expr("LOWER(wod.wod) LIKE LOWER(?)", fmt.Sprint("%", exercise, "%")))
		}
		baseQuery = baseQuery.Where(clause)
	}

	if len(filters.ExcludeExercise) > 0 {
		clause := sq.And{}
		for _, exercise := range filters.ExcludeExercise {
			clause = append(clause, sq.Expr("LOWER(wod.wod) NOT LIKE LOWER(?)", fmt.Sprint("%", exercise, "%")))
		}
		baseQuery = baseQuery.Where(clause)
	}

	return baseQuery
}

func processPictureFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if filters.Picture == nil {
		return baseQuery
	}

	if *filters.Picture == true {
		baseQuery = baseQuery.Where(sq.NotEq{"wod.picture": nil})
	}

	if *filters.Picture == false {
		baseQuery = baseQuery.Where(sq.Eq{"wod.picture": nil})
	}

	return baseQuery
}

func processTypeFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if len(filters.Type) > 0 {
		baseQuery = baseQuery.Where(sq.Expr("LOWER(?) = ANY(LOWER(type::text)::text[])", filters.Type))
	}

	return baseQuery
}

func processTriedFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if filters.Tried == nil {
		return baseQuery
	}

	if *filters.Tried == true {
		baseQuery = baseQuery.Where(sq.NotEq{"activity.id": nil})
	}

	if *filters.Tried == false {
		baseQuery = baseQuery.Where(sq.Eq{"activity.id": nil})
	}

	return baseQuery
}

func processBestTimeFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if filters.BestTimeMin != nil {
		baseQuery = baseQuery.Having("MIN(activity.time_taken) >= ?", filters.BestTimeMin)
	}

	if filters.BestTimeMax != nil {
		baseQuery = baseQuery.Having("MIN(activity.time_taken) <= ?", filters.BestTimeMax)
	}

	return baseQuery
}

func processBestScoreFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if filters.BestScoreLow != nil {
		baseQuery = baseQuery.Having("MAX(activity.score) >= ?", filters.BestScoreLow)
	}

	if filters.BestScoreHigh != nil {
		baseQuery = baseQuery.Having("MAX(activity.score) <= ?", filters.BestScoreHigh)
	}

	return baseQuery
}

func processBestMEPSFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if filters.BestMEPSLow != nil {
		baseQuery = baseQuery.Having("MAX(activity.meps) >= ?", filters.BestMEPSLow)
	}

	if filters.BestMEPSHigh != nil {
		baseQuery = baseQuery.Having("MAX(activity.meps) <= ?", filters.BestMEPSHigh)
	}

	return baseQuery
}

func processBestExertionFilter(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
	if filters.BestExertionLow != nil {
		baseQuery = baseQuery.Having("MAX(activity.exertion) >= ?", filters.BestExertionLow)
	}

	if filters.BestExertionHigh != nil {
		baseQuery = baseQuery.Having("MAX(activity.exertion) <= ?", filters.BestExertionHigh)
	}

	return baseQuery
}
