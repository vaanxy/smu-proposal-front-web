# SMU工会提案系统前端

## 1.项目拟采用框架

### css框架

本项目采用SASS作为CSS预处理器，使用的CSS框架如下所示：

1. bootstrap 3.3.X
2. AdminLTE

### js框架

1. Angular 1.4.x

## 2.项目构建

使用以下命令将bower下载的包注入index.html对应注解位置

```
gulp bower
```

使用以下命令将项目自动打包、压缩、混淆，最终生成生产环境部署版本

```
gulp
```

使用以下命令将实现livereload，方便开发

```
gulp watch
```
