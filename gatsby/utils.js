module.exports = {
  MinutesToDuration: function(s) {
    var days = Math.floor(s / 1440);
    s = s - days * 1440;
    var hours = Math.floor(s / 60);
    s = s - hours * 60;

    var dur = "PT";
    if (days > 0) {
      dur += days + "D";
    }
    if (hours > 0) {
      dur += hours + "H";
    }
    dur += s + "M";

    return dur;
  }
};
