module.exports = {
  '**/*.[jt]s?(x)': (filenames) => {
    const files = filenames
      .map((file) => {
        // 使用相对路径，处理 Windows 路径分隔符
        const relativePath = file.replace(process.cwd(), '').replace(/^[\\/]/, '');
        return relativePath;
      })
      .filter(Boolean); // 过滤掉空值

    if (files.length === 0) {
      return 'echo "No files to lint"';
    }

    return `next lint --fix --file ${files.join(' --file ')}`;
  },
};
