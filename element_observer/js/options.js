$(function() {

    // 登録されているデータ取得
    var defaults = {
        poElementObserverTarget: '',
    };
    chrome.storage.sync.get(defaults, function(info) {
        var dataJson = info.poElementObserverTarget;
        if (dataJson === '') {
            return;
        }
        var data = JSON.parse(dataJson);
        for (var key in data) {
            $('#add-target').trigger('click');
            var divArea = $('#target-area .target-element:last');
            divArea.find('input[name="effective"]').prop('checked', data[key].effective);
            divArea.find('input[name="selector"]').val(data[key].selector);
            divArea.find('input[name="valueType' + key + '"]').val([data[key].valueType]);
            divArea.find('input[name="interval"]').val(data[key].interval);
        }
    });

    $('#add-target').on('click', function() {
        $('#target-area').append('<div style="margin-top:10px;"></div>')
        $('#dummy-target-area').find('.target-element').clone().appendTo('#target-area div:last').show();
        // 全てのラジオボタンがグルーピングされないように、ラジオボタンのnameを変える
        // 既に存在するリストの行数をindexとして使用する
        var listCount = $('#target-area .target-element').length - 1;
        $('#target-area .target-element:last').find('input[name="valueType"]').attr('name', 'valueType' + listCount);
    });

    $('#save-target').on('click', function() {
        var list = $('#target-area').find('.target-element');
        var saveList = [];
        for (var i = 0; i < list.length; i++) {
            // 有効無効
            var effective = $(list[i]).find('input[name="effective"]').prop('checked');
            // セレクタ
            var selector = $(list[i]).find('input[name="selector"]').val();
            // 値タイプ
            var valueType = $(list[i]).find('input[name="valueType' + i + '"]:checked').val();
            // 監視間隔
            var interval = $(list[i]).find('input[name="interval"]').val();
            saveList[saveList.length] = {
                effective: effective,
                selector: selector,
                valueType: valueType,
                interval: interval
            };
        }
        var saveInfo = {
            poElementObserverTarget: JSON.stringify(saveList)
        };
        chrome.storage.sync.set(saveInfo);
    });

    // $(document).on('click', '.valueType', function() {
    //     if ($(this).val() === '2') {
    //         $(this).parents('.target-element').find('input[name="cssTarget"]').show();
    //     } else {
    //         $(this).parents('.target-element').find('input[name="cssTarget"]').hide();
    //     }
    // });


    // $('#extend-process').on('click', function() {
    //     $('#import-export-area').show();
    // })
    // $('#import').on('click', function() {
    //     if (window.confirm('不正なJSON文字列の場合、データが破損する可能性があります。インポートを実行してよろしいでしょうか？')) {
    //         var updateInfo = {
    //             snippets: $('#import-export-text').val()
    //         };
    //         chrome.storage.sync.set(updateInfo);
    //     } else {
    //         alert('キャンセルしました。');
    //     }
    // });
    // $('#export').on('click', function() {
    //     // 登録されているデータ取得
    //     var defaults = {
    //         snippets: '',
    //     };
    //     chrome.storage.sync.get(defaults, function(info) {
    //         var dataJson = info.snippets;
    //         if (dataJson === '') {
    //             return;
    //         }
    //         $('#import-export-text').val(dataJson);
    //     });
    // });
});
