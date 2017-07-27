// chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
//     poElementObserver.initialize();
// });

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "poToggleDialog") {
        poElementObserver.toggleDialog();
    }
});

$(function() {
    // ダイアログを埋め込む
    var cssProp = {
        'display': 'none',
        'position': 'absolute',
        'right': '10px',
        'top': '10px',
        'z-index': '9999',
        'background-color': 'white',
        'cursor': 'move',
        'width': '300px',
        'height': '200px',
        'border': '#d0d0d0 outset 5px',
    };
    var poElementObserverDialogHtmlStr =
        '<div id="po-element-observer-dialog"></div>'
    $(poElementObserverDialogHtmlStr)
        .css(cssProp)
        .resizable()
        .draggable()
        .appendTo('body');

    // ダイアログの表示非表示状態取得
    var defaults = {
        poElementObserverDialogVisible: false
    };
    chrome.storage.sync.get(defaults, function(info) {
        info.poElementObserverDialogVisible;
        if (info.poElementObserverDialogVisible !== null && info.poElementObserverDialogVisible) {
            $('#po-element-observer-dialog').show();
        }
    });

    // 監視対象の要素情報取得
    // 指定されたセレクタを取得する
    var selectorList = [];
    var defaults = {
        poElementObserverTarget: '',
    };
    chrome.storage.sync.get(defaults, function(info) {
        var dataJson = info.poElementObserverTarget;
        if (dataJson === '') {
            return;
        }
        selectorList = JSON.parse(dataJson);
        for (var i = 0; i < selectorList.length; i++) {
            // 有効無効を判定
            if (!selectorList[i].effective) {
                continue;
            }
            // ダイアログに枠を確保
            var inputArea = $('<input type="text" style="margin-top:5px; margin-right:5px; width:90%;">').appendTo('#po-element-observer-dialog');
            // タイトルをつける
            inputArea.before($('<label>' + selectorList[i].selector + '</label><br>'));
            var param = {
                index: i,
                inputArea: inputArea
            };
            // interval関数で監視
            (function(param) {
                var interval = selectorList[param.index].interval;
                interval = (typeof interval !== 'undefined' && interval !== '') ? interval : 2000;
                setInterval(function() {
                    // 値取得
                    var targetValue = '';
                    if (typeof selectorList[param.index].valueType === 'undefined' || selectorList[param.index].valueType === '0') {
                        // val()
                        targetValue = $(selectorList[param.index].selector).val();
                    } else if (selectorList[param.index].valueType === '1') {
                        // text()
                        targetValue = $(selectorList[param.index].selector).text();
                    }
                    // ダイアログに値表示
                    param.inputArea.val(targetValue);
                }, interval);
            })(param);
        }

    });

});


var poElementObserver = {
    toggleDialog: function() {

        var save = function(visible) {
            var info = {
                poElementObserverDialogVisible: visible
            };
            chrome.storage.sync.set(info);
        }

        var contents = $('#po-element-observer-dialog');
        if ($(contents).is(':visible')) {
            contents.hide();
            save(false);
        } else {
            contents.show();
            save(true);
        }

    }
};
