function extractRoles(body) {
  // This is ugly code, meant to extract role assignnments from free-text github 
  // issue bodies.
  
  if (!body) return [];
  var roles = [];
  var lines = body.split(/\r?\n/);
  lines.forEach(function(line) {
    console.log("--- ", line);
    if (! line) return;
    var bits = line.split(":", 2);
    var before, after, role, newAssignee;
    before = bits[0];
    after = bits[1];
    console.log(before, after);
    if (!after) return;
    if (!before) return;
    after = after.trim();
    before = before.trim();
    if (before.indexOf("* ") == 0) {
      before = before.slice(2);
    }
    if (after && after.split().length > 5) return;
    role = before.trim();
    if (role.indexOf("http") == 0) {
      return;
    }
    newAssignee = bits[1].trim();
    if (newAssignee.indexOf("http") == 0) {
      return;
    }
    if ((role.indexOf('.') != -1) || (newAssignee.indexOf(".") != -1)) {
      return;
    }
    role = role.toLowerCase();
    if (role && newAssignee) {
      if ((role === "lead dev") ||
          (role === "lead design") ||
          (role.indexOf("dev") == 0) ||
          (role.indexOf("design") == 0) ||
          (role.indexOf("decision") == 0) ||
          (role.indexOf("quality") == 0) ||
          (role === "driver") ||
          (role === "owner")) {
        roles.push([encodeURIComponent(role), encodeURIComponent(newAssignee)]);
      }
    }
  });
  return roles;
}

module.exports = extractRoles;