const MAX_FILES = 40;
const MAX_ACTIVITY_ITEMS = 5;
const MAX_TEXT_LENGTH = 1200;

const trimText = (value = "", limit = MAX_TEXT_LENGTH) =>
  String(value).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, limit);

const listValues = (values = []) => values.slice(0, 20).map((value) => trimText(value, 160));

export const buildProjectContext = ({ project, engineeringContext, snapshot }) => ({
  project: {
    name: trimText(project.name, 160),
    description: trimText(project.description, 500),
    repository: trimText(snapshot.metadata?.fullName || project.github?.fullName, 200),
  },
  summary: trimText(engineeringContext.summary),
  architecture: trimText(engineeringContext.architecture),
  technologies: Object.fromEntries(
    Object.entries(engineeringContext.technologies || {}).map(([key, values]) => [
      key,
      listValues(values),
    ])
  ),
  importantFiles: (engineeringContext.importantFiles || [])
    .slice(0, MAX_FILES)
    .map((file) => ({ path: trimText(file.path, 240), purpose: trimText(file.purpose, 240) })),
  projectStructure: (engineeringContext.projectStructure || [])
    .slice(0, MAX_FILES)
    .map((file) => ({ path: trimText(file.path, 240), type: trimText(file.type, 40) })),
  activity: engineeringContext.activity || {},
  recentCommits: (snapshot.commits || []).slice(0, MAX_ACTIVITY_ITEMS).map((commit) => ({
    message: trimText(commit.message, 240),
    author: trimText(commit.author, 120),
    date: commit.date || null,
  })),
  openIssues: (snapshot.issues || []).slice(0, MAX_ACTIVITY_ITEMS).map((issue) => ({
    title: trimText(issue.title, 240),
    state: trimText(issue.state, 40),
  })),
  openPullRequests: (snapshot.pullRequests || []).slice(0, MAX_ACTIVITY_ITEMS).map((pullRequest) => ({
    title: trimText(pullRequest.title, 240),
    state: trimText(pullRequest.state, 40),
  })),
});
