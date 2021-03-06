package de.thm.ii.fbs.services.persistence

import com.fasterxml.jackson.databind.ObjectMapper
import de.thm.ii.fbs.model.{CourseResult, TaskResult}
import de.thm.ii.fbs.util.DB
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

import java.sql.ResultSet

/**
  *
  */
@Component
class CourseResultService {
  @Autowired
  private implicit val jdbc: JdbcTemplate = null
  @Autowired
  private val courseRegistration: CourseRegistrationService = null
  @Autowired
  private val objectMapper: ObjectMapper = null

  /**
    * Get All Course Results
    * @param cid Course id
    * @return all Course Results
    */
def getAll(cid: Int): List[CourseResult] = DB.query("""
    |select u.user_id
    |     ,u.prename
    |     ,u.surname
    |     ,u.email
    |     ,u.username
    |     ,u.global_role
    |     ,u.alias
    |     ,JSON_ARRAYAGG(JSON_OBJECT("task", JSON_OBJECT("id", t.task_id,
    |                                                    "name", t.name,
    |                                                    "deadline", t.deadline,
    |                                                    "mediaType", t.media_type,
    |                                                    "description", t.description),
    |                                "attempts", coalesce(submissions.attempts, 0),
    |                                "passed", coalesce(submissions.passed, 0)
    |    )) as results
    |     ,COALESCE(FLOOR(SUM(submissions.passed) / COUNT(DISTINCT t.task_id)), 0) as passed
    |from user u
    |         left join user_course uc using (user_id)
    |         left join task t using (course_id)
    |         left join (
    |             select temp.user_id
    |                   ,temp.task_id
    |                   ,count(distinct temp.submission_id) as attempts
    |                   ,max(temp.passed) as passed
    |             from (
    |                select uts.user_id
    |                      ,uts.task_id
    |                      ,uts.submission_id
    |                      ,IF(SUM(cr.exit_code) = 0, 1, 0) as passed
    |                from user_task_submission uts
    |                left join checker_result cr using (submission_id)
    |                group by uts.user_id, uts.task_id, uts.submission_id
    |                order by uts.user_id
    |             ) as temp
    |             group by temp.user_id, temp.task_id
    |         ) as submissions using (user_id, task_id)
    |where course_id = ?
    |group by u.user_id
    |order by u.user_id;
    |""".stripMargin, (res, _) => parseResult(res), cid)

  private def parseResult(res: ResultSet): CourseResult = CourseResult(
    courseRegistration.parseUserResult(res), res.getBoolean("passed"),
    objectMapper.readValue(res.getString("results"), classOf[Array[TaskResult]]).toList.sorted
  )
}
