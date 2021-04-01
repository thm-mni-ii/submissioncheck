package de.thm.ii.fbs.util

import org.springframework.util.FileCopyUtils
import org.springframework.web.multipart.MultipartFile

import java.nio.file.{Files, Path}


/**
  * Contains File Upload helper
  * @author Max Stephan
  */
object FileUploadUtils {
  /**
    * Transfer a file and filter its Content
    * @param file the file to transfer
    * @param dest the transfer destination
    * @param filter the filter function
    * @throws  java.io.IOException in case of I/O errors
    */
  def transferAndFilter(file: MultipartFile, dest: Path, filter: Byte => Boolean): Unit = {
    val contentType = file.getContentType

    if (contentType != null && (contentType.startsWith("text/") || contentType.startsWith("application/x-shellscript"))) {
      FileCopyUtils.copy(file.getBytes.filter(filter), Files.newOutputStream(dest))
    } else {
      file.transferTo(dest)
    }
  }
}
