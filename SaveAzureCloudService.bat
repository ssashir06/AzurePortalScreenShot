@echo off

cd %~dp0

:: ディレクトリ準備
set tm=%time:~0,8%
set tm=%tm::=%
set tm=%tm: =0%
set DATETIME=Result%DATE:~-10,4%%DATE:~-5,2%%DATE:~-2%%tm%
echo %DATETIME%
if not exist "%DATETIME%" (
    mkdir "%DATETIME%"
)


pushd %DATETIME%

set PHANTOMJS="C:\path\to\bin\phantomjs.exe"
set SCRIPT="..\AzureCloudServiceScreenShot.js"
set MAILADDRESS="MAILADDRESS"
set PASSWORD="PASSWORD"
set TENANTID="TENANTID_GUID"
set SUBSCRIPTIONID="SUBSCRIPTIONID_GUID"

%PHANTOMJS% %SCRIPT% %MAILADDRESS% %PASSWORD% %TENANTID% %SUBSCRIPTIONID%

popd

