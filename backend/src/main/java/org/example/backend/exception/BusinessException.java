package org.example.backend.exception;

/**
 * 비즈니스 로직 예외를 처리하기 위한 커스텀 예외
 * ErrorCode를 통해 일관된 에러 메시지 제공
 */
public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}

