// Azure旧ポータルへのログイン
var azureManageLogin = function(dfr, loginMailAddress, loginPassword, loginTenantId, loginSubscriptionId) {
    var initialUrl = 'https://manage.windowsazure.com';
    return dfr.then(function(dfr) {
        page.open(initialUrl, function(status) {
            if (status !== 'success') {
                console.log('Cannot open page:' + status);
                phantom.exit();
            } else {
                console.log('Status: ' + status);
            }
        });

        dfr.waitPage(3000);
    }).then(function(dfr) {
        page.evaluate(function(loginMailAddress) {
            console.log('メールアドレス入力');
            $('#cred_userid_inputtext').val(loginMailAddress);
            $('#cred_continue_button').click();
        }, loginMailAddress);

        dfr.waitTime(3000);
    }).then(function(dfr) {
        console.log('個人アカウントを選択');
        page.evaluate(function() {
            $('#mso_account_tile').click();
        });
        dfr.waitPage(3000);
    }).then(function(dfr) {
        console.log('パスワード入力');
        page.evaluate(function(loginPassword) {
            document.getElementById('i0118').value=loginPassword;
            document.getElementById('idSIButton9').click();
        }, loginPassword);
        dfr.waitPage(10000);
    }).then(function(dfr) {
        console.log('テナントIDとサブスクリプションIDを選択');
        page.evaluate(function() {
            $('a.fxs-subscriptionpicker-tray').click();
        });
        page.evaluate(function(loginTenantId) {
            $('div.fxs-subscriptionpicker-tenantselectbox > select').val(loginTenantId);
            $('div.fxs-subscriptionpicker-tenantselectbox > select').change();
        }, loginTenantId);
        page.evaluate(function(loginSubscriptionId) {
            // 未選択状態にする
            while ($('div.fxs-subscriptionpicker-checkbox.fx-tristatecheckbox > input').val() != 'checked') {
                $('div.fxs-subscriptionpicker-item-text[data-bind="text: text.selectAll"]').click();
            }
            $('div.fxs-subscriptionpicker-item-text[data-bind="text: text.selectAll"]').click();

            // サブスクリプションを選択する
            $('li.__fxs-subscriptionpicker-sub-'+loginSubscriptionId).find('div.fxs-subscriptionpicker-item-text').click();
        }, loginSubscriptionId);
        page.evaluate(function() {
            $('div.fxs-subscriptionpicker-applybutton').click();
        });
        dfr.waitPage(10000);
    }).then(function(dfr) {
        dfr.resolve();
    });
};

// クラウドサービス 監視を撮影
var azureOpenCloudAudit = function(dfr, deployName, slot, mode, span) {
    // slot .. production / staging
    // mode .. absolute / relative
    // span .. hour / day / week

    return dfr.then(function(dfr) {
        console.log('DeployName='+deployName+', Slot='+slot+', Mode='+mode+', Span='+span);
        console.log('すべてのページを開く');
        page.evaluate(function() {
            $($('div.fxshell-nav1-icon')[0]).find('img').click();
        });
        dfr.waitTime(1000);
    }).then(function(dfr) {
        console.log('クラウドサービスを開く');
        page.evaluate(function(deployName) {
            $('#tabcontainer').find('a[href="#Workspaces/CloudServicesExtension/CloudService/'+deployName+'"] > span').click();
        }, deployName);
        dfr.waitTime(1000);
    }).then(function(dfr) {
        console.log('監視を開く');
        page.evaluate(function() {
            $('ul[role="pivotlist"] > li')[3].click();
        });
        dfr.waitTime(1000);
    }).then(function(dfr) {
        console.log('スロットを選択する');
        page.evaluate(function(slot) {
            if (slot === 'production') {
                $('#hs-environment-switcher').find('li.first-child').click();
            } else {
                $('#hs-environment-switcher').find('li.second-child').click();
            }
        }, slot);
        dfr.waitTime(1000);
    }).then(function(dfr) {
        page.evaluate(function(slot, mode, timeRange) {
            $('#hs-'+slot).find('div.chartScale').find('.fx-dropdown-list > li')[mode].click();
        }, slot, (mode === 'absolute' ? 1 : 0), (span === 'hour' ? 0 : span === 'day' ? 1 : 2));
        dfr.waitTime(3000);
    }).then(function(dfr) {
        page.evaluate(function(slot, mode, timeRange) {
            $('#hs-'+slot).find('div.chartScale').find('.fx-dropdown-list > li')[mode].click();
        }, slot, (mode === 'absolute' ? 1 : 0), (span === 'hour' ? 0 : span === 'day' ? 1 : 2));
        dfr.waitTime(3000);
    }).then(function(dfr) {
        page.evaluate(function(slot, mode, timeRange) {
            $('#hs-'+slot).find('div.timeRange').find('.fx-dropdown-list > li')[timeRange].click();
        }, slot, (mode === 'absolute' ? 1 : 0), (span === 'hour' ? 0 : span === 'day' ? 1 : 2));
        dfr.waitTime(3000);
    }).then(function(dfr) {
        page.evaluate(function(slot, mode, timeRange) {
            $('#hs-'+slot).find('div.timeRange').find('.fx-dropdown-list > li')[timeRange].click();
        }, slot, (mode === 'absolute' ? 1 : 0), (span === 'hour' ? 0 : span === 'day' ? 1 : 2));
        dfr.waitTime(3000);
    }).then(function(dfr) {
        // 念のためグラフ表示の時間をとる
        dfr.waitTime(10000);
    }).then(function(dfr) {
        var clipRect = page.evaluate(function(){
            return document.querySelector('#tabcontainer').getBoundingClientRect();
        });
        var clipRectOrig = page.clipRect;
        page.clipRect = {
            top:    clipRect.top,
            left:   clipRect.left,
            width:  clipRect.width,
            height: clipRect.height
        };
        savePage('ScreenShot - '+deployName);
        page.clipRect = clipRectOrig;
        dfr.resolve();
    });
};
