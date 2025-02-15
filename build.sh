#!/bin/bash

# 设置版本号和构建目录
VERSION="1.0.0"
BUILD_DIR="output"

# 创建构建目录
create_build_dir() {
    if [ ! -d "$BUILD_DIR" ]; then
        mkdir -p "$BUILD_DIR"
        echo "创建构建目录"
    fi
}

# 清理并创建构建目录
clean_and_create_build_dir() {
    echo "清理并创建构建目录..."
    rm -rf "$BUILD_DIR" && mkdir -p "$BUILD_DIR"
    echo "构建目录已清理并创建"
}

# 清理并准备构建目录
clean_and_create_build_dir
create_build_dir

# 设置构建时间和Git提交信息
BUILD_TIME=$(date "+%F %T")

echo "开始构建版本: $VERSION"
echo "构建时间: $BUILD_TIME"

# 构建 macOS ARM64 版本
echo "构建工程产物..."
npm run build || { echo "项目构建失败"; exit 1; }

echo "项目构建成功"

# 拷贝必要依赖
cp -r .next package.json next.config.mjs "$BUILD_DIR"

# 为构建的项目安装依赖
cd "$BUILD_DIR" && pnpm install --prod && \
 rm -rf node_modules/.pnpm/@next+swc-linux-x64* \
 rm -rf .next/cache

echo "构建完成！"
