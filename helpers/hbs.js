const moment = require('moment');

module.exports = {
  formatDate: function(date, format) {
    return moment(date).format(format || 'MMMM Do YYYY, h:mm:ss a');
  },
  truncate: function(str, len) {
    if (str && str.length > len) {
      let new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  stripTags: function(input) {
    return input?.replace(/<(?:.|\n)*?>/gm, '') || '';
  },
  encodeURIComponent: function(str) {
    return str ? encodeURIComponent(str) : '';
  },
  replace: function(str, find, replace) {
    return str?.replace(new RegExp(find, 'g'), replace) || '';
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  select: function(selected, options) {
    const html = options.fn(this);
    const escapedSelected = selected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return html
      .replace(new RegExp(` value="${escapedSelected}"`), '$& selected="selected"')
      .replace(new RegExp(`>${escapedSelected}</option>`), ' selected="selected">$&');
  },
  eq: function (a, b) {
    return a === b;
  },
};