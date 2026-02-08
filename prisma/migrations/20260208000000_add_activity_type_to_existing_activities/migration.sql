-- Migration to add activityType field to existing activities in RiskFactors and RiskFactorData tables
-- Default value is 'PERICULOSIDADE' for all existing activities

-- Update RiskFactors.activities JSON field
-- This updates all activities in the RiskFactors table to include activityType: 'PERICULOSIDADE'
UPDATE "RiskFactors"
SET activities = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(activity) = 'object' THEN
        activity || jsonb_build_object('activityType', 'PERICULOSIDADE')
      ELSE
        activity
    END
  )
  FROM jsonb_array_elements(activities::jsonb) AS activity
)
WHERE activities IS NOT NULL
  AND activities::text != 'null'
  AND jsonb_typeof(activities::jsonb) = 'array';

-- Update RiskFactorData.activities JSON field
-- This updates the nested activities array within the activities object
UPDATE "RiskFactorData"
SET activities = (
  CASE
    WHEN activities IS NOT NULL 
      AND activities::text != 'null'
      AND jsonb_typeof(activities::jsonb) = 'object'
      AND activities::jsonb ? 'activities'
      AND jsonb_typeof(activities::jsonb->'activities') = 'array'
    THEN
      jsonb_set(
        activities::jsonb,
        '{activities}',
        (
          SELECT jsonb_agg(
            CASE 
              WHEN jsonb_typeof(activity) = 'object' THEN
                activity || jsonb_build_object('activityType', 'PERICULOSIDADE')
              ELSE
                activity
            END
          )
          FROM jsonb_array_elements(activities::jsonb->'activities') AS activity
        )
      )
    ELSE
      activities
  END
)
WHERE activities IS NOT NULL
  AND activities::text != 'null';

