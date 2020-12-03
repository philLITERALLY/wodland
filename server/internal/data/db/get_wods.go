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
	// "COUNT(activity.id) as attempts",
	// "MIN(activity.time_taken) as best_time",
	// "MAX(activity.score) as best_score",
	"activity.id",
	"activity.date",
	"activity.time_taken",
	"activity.meps",
	"activity.exertion",
	"activity.notes",
	"activity.score",
}

// GetWOD will get and return an individual WOD
func GetWOD(db *sql.DB, wodID string, userID int) (data.WOD, error) {
	var dbWOD = data.WOD{}
	var dbActivities []data.Activity

	wodQuery := psql.
		Select(wodColumns...).
		From("wod").
		LeftJoin("activity ON activity.wod_id = wod.id").
		Where(sq.Eq{"wod.id": wodID}).
		Where(sq.Eq{"activity.user_id": userID}).
		GroupBy("wod.id")
	sqlWODQuery, args, _ := wodQuery.ToSql()

	err := db.QueryRow(sqlWODQuery, args...).
		Scan(&dbWOD.ID, &dbWOD.Source, &dbWOD.CreationT, &dbWOD.Exercise, &dbWOD.Picture, pq.Array(&dbWOD.Type), &dbWOD.CreatedBy, &dbWOD.Attempts, &dbWOD.BestTime, &dbWOD.BestScore)
	if err != nil {
		return dbWOD, err
	}

	activityQuery := psql.
		Select("id, date, time_taken, score, meps, exertion, notes").
		From("activity").
		Where(sq.Eq{"wod_id": wodID}).
		Where(sq.Eq{"activity.user_id": userID})
	sqlActivityQuery, args, _ := activityQuery.ToSql()

	rows, err := db.Query(sqlActivityQuery, args...)
	if err != nil {
		return dbWOD, err
	}

	defer rows.Close()
	for rows.Next() {
		var activity data.Activity

		if err := rows.Scan(&activity.ID, &activity.Date, &activity.TimeTaken, &activity.Score, &activity.MEPs, &activity.Exertion, &activity.Notes); err != nil {
			return dbWOD, err
		}

		dbActivities = append(dbActivities, activity)
	}

	if len(dbActivities) > 0 {
		dbWOD.Activities = &dbActivities
	}

	return dbWOD, nil
}

// GetWODs will get and return WODs
func GetWODs(db *sql.DB, filters *data.WODFilter, userID int) ([]data.WOD, error) {
	var dbWODs = []data.WOD{}

	selectQuery := psql.
		Select(wodColumns...).
		From("wod").
		LeftJoin("activity ON activity.wod_id = wod.id AND activity.user_id = ?", userID).
		OrderBy("random()")

	selectQuery = processWODFilters(selectQuery, filters)
	selectQuery = selectQuery.Limit(10)
	sqlQuery, args, _ := selectQuery.ToSql()

	fmt.Printf("selectQuery: %v \n", sqlQuery)
	fmt.Printf("args: %v \n", args)

	rows, err := db.Query(sqlQuery, args...)
	if err != nil {
		fmt.Printf("db err: %v \n", err)
		return nil, err
	}

	var wodActivities = make(map[int][]data.Activity)
	defer rows.Close()
	for rows.Next() {
		var wod data.WOD
		var (
			ActivityID        *int64
			ActivityDate      *int64
			ActivityTimeTaken *int64
			ActivityMEPs      *int64
			ActivityExertion  *int64
			ActivityNotes     *string
			ActivityScore     *int
		)

		if err := rows.Scan(
			&wod.ID, 
			&wod.Source, 
			&wod.CreationT, 
			&wod.Exercise, 
			&wod.Picture, 
			pq.Array(&wod.Type), 
			&wod.CreatedBy, 
			// &wod.Attempts, 
			// &wod.BestTime, 
			// &wod.BestScore
			&ActivityID,
			&ActivityDate,
			&ActivityTimeTaken,
			&ActivityMEPs,
			&ActivityExertion,
			&ActivityNotes,
			&ActivityScore,
		); err != nil {
			fmt.Printf("scan err: %v \n", err)
			return nil, err
		}

		if ActivityID != nil {
			activity := data.Activity{ 
				ID: *ActivityID,
				ActivityInput: data.ActivityInput{
					Date:      *ActivityDate,
					TimeTaken: *ActivityTimeTaken,
					MEPs:      ActivityMEPs,
					Exertion:  ActivityExertion,
					Notes:     ActivityNotes,
					Score:     ActivityScore,
				},
			}
			
			if activities, ok := wodActivities[wod.ID]; ok {
				wodActivities[wod.ID] = append(activities, activity)
			} else {
				wodActivities[wod.ID] = []data.Activity{activity} 
			}
		}

		dbWODs = append(dbWODs, wod)
	}

	for index, wod := range dbWODs {
		thisWODsActivities := wodActivities[wod.ID]
		if thisWODsActivities != nil {
			wod.Activities = &thisWODsActivities
			dbWODs[index] = wod
		}
	}

	return dbWODs, nil
}

func processWODFilters(baseQuery sq.SelectBuilder, filters *data.WODFilter) sq.SelectBuilder {
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
