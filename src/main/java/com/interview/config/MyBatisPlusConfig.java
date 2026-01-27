package com.interview.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.core.config.GlobalConfig;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;

@Configuration
public class MyBatisPlusConfig {

    /**
     * MyBatis-Plus 拦截器
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 分页插件
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.SQL_SERVER));
        return interceptor;
    }

    /**
     * 全局配置
     * 关键：关闭自动驼峰转换
     */
    @Bean
    public GlobalConfig globalConfig() {
        GlobalConfig globalConfig = new GlobalConfig();
        globalConfig.setDbConfig(new GlobalConfig.DbConfig()
                .setTableUnderline(false)  // 关键：不使用下划线命名
        );
        return globalConfig;
    }

    /**
     * 自动填充处理器
     */
    @Bean
    public MetaObjectHandler metaObjectHandler() {
        return new MetaObjectHandler() {
            @Override
            public void insertFill(MetaObject metaObject) {
                this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, LocalDateTime.now());
                this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
                this.strictInsertFill(metaObject, "selectedAt", LocalDateTime.class, LocalDateTime.now());
                this.strictInsertFill(metaObject, "favoritedAt", LocalDateTime.class, LocalDateTime.now());
                this.strictInsertFill(metaObject, "viewedAt", LocalDateTime.class, LocalDateTime.now());
                this.strictInsertFill(metaObject, "lastViewedAt", LocalDateTime.class, LocalDateTime.now());
            }

            @Override
            public void updateFill(MetaObject metaObject) {
                this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
                this.strictUpdateFill(metaObject, "lastViewedAt", LocalDateTime.class, LocalDateTime.now());
            }
        };
    }
}