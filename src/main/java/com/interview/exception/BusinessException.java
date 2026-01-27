package com.interview.exception;

import com.interview.common.ResultCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private Integer code;

    public BusinessException(String message) {
        super(message);
        this.code = ResultCode.INTERNAL_ERROR.getCode();
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
    }
}