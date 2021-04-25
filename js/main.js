/**
 * Danh sách list
 */
const list = [{
        value: 0,
        text: "Nữ"
    },
    {
        value: 1,
        text: "Nam"
    },
    {
        value: 2,
        text: "Khác"
    },
];

/**
 * Thẻ bao ngoài cùng combobox.
 */
const cbBox = $('.cb-autocomplete');

/**
 * Thẻ chứa danh sách của combobox.
 */
const dataListEle = cbBox.find('.datalist');

/**
 * Input  combobox.
 */
const combobox = cbBox.find('.cb');

/**
 * Phần tử hiện tại đang được hover combobox.
 */
let index = -1;

/**
 * Item đang được chọn.
 */
let selectedItem = null;
(function( $ ){
    $.fn.getValue = function() {
       return this.text();
    };
    $.fn.getText = function() {
        return this.val();
     };  
 })( jQuery );

$(function () {

    // sự kiện nhập vào input của combobox.
    combobox.on('input', function (e) {
        e.preventDefault();
        let val = $(this).val();
        if (val === '') {
            cbBox.removeClass('error');
            cbBox.find('.cb').removeAttr('title');
        }
        let datalist = list.filter((item) => item.text.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
        if (datalist.length == 0) {
            cbBox.addClass('error');
            cbBox.find('.cb').attr('title', "Dữ liệu không tồn tại trong hệ thống.");
        } else {
            cbBox.removeClass('error');
            cbBox.find('.cb').removeAttr('title');
        }
        bindDataListToHtml(datalist, true);
        index = -1;
    });

    // sự kiện click vào một item trong danh sách của combobox.
    cbBox.on('mousedown', '.datalist li', function (e) {
        e.preventDefault();
        selectItemCombobox($(this));
    });

    // sự kiện click vào icon toggle của combobox.
    cbBox.find('.icon').on('mousedown', function (e) {
        e.preventDefault();
        if (dataListEle.hasClass('hide')) {
            combobox.focus();
            bindDataListToHtml(list, false);
            index = -1;
        } else {
            dataListEle.addClass('hide');
        }
    });

    // sự kiện lose focus trong input combobox.
    cbBox.on('focusout', function (e) {
        e.preventDefault();
        dataListEle.addClass('hide');
    })

    // sự kiện nhấn phím trong combobox.
    cbBox.on('keydown', function (e) {
        let keyCode = e.keyCode;
        let count = dataListEle.find('li').length;

        if (keyCode == 40) {
            // khi nhấn phím mũi tên xuống.
            e.preventDefault();

            if (index < count - 1) {
                dataListEle.find('li').eq(index).removeClass('hover');
                dataListEle.find('li').eq(index + 1).addClass('hover');
                index++;
            }

        } else if (keyCode == 38) {
            // khi nhấn phím mũi tên lên.
            e.preventDefault();
            if (index > 0) {
                dataListEle.find('li').eq(index).removeClass('hover');
                dataListEle.find('li').eq(index - 1).addClass('hover');
                index--;
            }
        } else if (keyCode == 13) {
            // khi nhấn chọn enter.
            e.preventDefault();
            let _this = dataListEle.find('li.hover');
            selectItemCombobox(_this);
        }
    });

});

/**
 * Hàm bind data vào html cho danh sách combobox.
 * @param {Array} datalist danh sách hiện tại của combobox.
 * @param {Boolean} isInput Xác định đang nhập dữ liệu hay đang click vào icon toggle.
 */
function bindDataListToHtml(datalist, isInput) {
    if (isInput) {
        selectedItem = null;
    }
    dataListEle.html('');
    datalist.forEach((item) => {
        var dataItem = $(`
            <li>
                <span class="item-icon"></span>
                <span class="item-text">${item.text}</span>
            </li>
        `);
        if (selectedItem && selectedItem.value == item.value) {
            dataItem.addClass('selected');
        }
        dataItem.data(item);
        dataItem.appendTo(dataListEle);
    });
    dataListEle.removeClass('hide');
}

/**
 * Hàm chọn một item trong danh sách của combobox.
 * @param {Element} eleSelected Item được chọn trong danh sách của combobox.
 */
function selectItemCombobox(eleSelected) {
    let data = eleSelected.data();
    if(!data){
        return;
    }
    selectedItem = data;
    combobox.text(data.value);
    combobox.val(data.text);
    combobox.focus();
    dataListEle.addClass('hide');
}
// jQuery.fn.extend({

// })