const { notarize } = require('@electron/notarize')

exports.default = async function packageTask(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    // "tool": "notarytool",
    // appBundleId: "com.xxx.xxx",
    appPath: `${appOutDir}/${appName}.app`,
    // appleId: "xxx@xxx.com",
    // appleIdPassword: `@keychain:AC_PASSWORD`,
    // teamId: 'xxxxxxxxxx'
    keychainProfile: `AC_PASSWORD`
  })
}

// 运行这个命令，把证书存到钥匙串(Mac 电脑)
// xcrun notarytool store-credentials "AC_PASSWORD" --apple-id "xxx@xxx.com" --team-id "xxxxxxxxx" --password "xxxx-xxxx-xxxx-xxxx"
// team-id 在 https://developer.apple.com/account 里面
// password 是 app 专用密码，不是账号密码，在 https://appleid.apple.com/account/manage 的 App-Specific Passwords 里面
