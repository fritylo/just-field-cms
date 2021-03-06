$(document).ready(() => {
   const pref = '.item_T_image'; // prefix for current folder
   const updateLink = document.querySelector('table').dataset.updateLink;

   when(`${pref} init`, function (i, row) {
      const item = row;
      const $buttonUpload = $(`${pref}__upload-button`, row);
      const $buttonShow = $(`${pref}__show-button`, row);
      const $thumbnail = $(`${pref}__thumbnail`, row);
      const $file = $(`${pref}__file`, row);

      $buttonShow.on('click', action(`click: ${pref} button show`));
      $buttonUpload.on('click', () => action(`click: ${pref} button upload`)($file));
      $file.on('change', () => action(`change: ${pref} file`)($buttonShow, $file, item, $thumbnail));
   });
   $(`${pref}`).each(action(`${pref} init`));

   when(`click: ${pref} button show`, e => {
      $.magnificPopup.open({
         items: {
            src: e.target.dataset.mfpSrc
         },
         verticalFit: true,
         type: 'image',
      });
   });
   when(`click: ${pref} button upload`, $file => {
      $file.trigger('click');
   });
   when(`change: ${pref} file`, async ($buttonShow, $file, item, $thumbnail) => {
      const fetchUrl = updateLink;

      const formData = new FormData();
      formData.append('item_id', item.dataset.itemId);
      formData.append('colname', 'value');
      formData.append('value', $file[0].files[0]);

      let res = await fetchJsonOk('Uploading', fetchUrl, {
         method: 'POST',
         body: formData,
      });

      $buttonShow[0].dataset.mfpSrc = res.data;
      $buttonShow.removeAttr('disabled');

      const $thumbnailImg = $thumbnail.removeClass(`${pref}__thumbnail_free`.slice(1)).find('img').removeClass('dn');
      $thumbnailImg.attr('src', res.data + '?' + new Date());
   });

   window.item_T_image_handle = function (row) {
      action(`${pref} init`)(0, row);
   };
});