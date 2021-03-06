package de.thm.ii.fbs.model

import com.fasterxml.jackson.databind.JsonNode

/**
  * Check result of a single check
  *
  * @param exitCode        Exit code of the check
  * @param resultText      Output text of the checker
  * @param checkerType     The checker type that checked the submission
  * @param configurationId Checker configuration id
  * @param extInfo         Checker extended information
  */
case class CheckResult(exitCode: Int = 1, resultText: String, checkerType: String, configurationId: Int, extInfo: JsonNode)
