package de.thm.ii.submissioncheck.misc

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

/**
  * ResourceNotFoundException simply sends an error 404
  * @author Benjamin Manns
  */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
class ResourceNotFoundException extends RuntimeException

/**
  * BadRequestException simply sends an error 400 with a user defined error message
  * @param message A human readable String
  * @author Benjamin Manns
  */
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
class BadRequestException(message: String) extends RuntimeException {
  /** message string which is the answer of a bad 400 Request*/
  var detailMessage: String = message

  /**
    * Overrides base class RuntimeException method
    * @return message string
    */
  override def getMessage: String = detailMessage
}

/**
  * UnauthorizedException
  * @author Benjamin Manns
  */
@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
class UnauthorizedException() extends RuntimeException
