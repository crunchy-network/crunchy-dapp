export function gatherAllProjectJsonFiles() {
  const context = require.context("../assets/projects", true, /.json$/);
  const all = [];
  context.keys().forEach((key) => {
    const fileName = key.replace("./", "");
    const resource = require(`../assets/projects/${fileName}`);
    all.push(JSON.parse(JSON.stringify(resource)));
  });
  all.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });
  return all;
}

export function importAll(r) {
  const files = {};
  r.keys().map((item) => {
    files[item.replace("./", "")] = r(item);
  });
  return files;
}
