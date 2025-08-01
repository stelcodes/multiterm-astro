import GitHubCalendar from 'react-github-calendar'

const themeFromColorscheme = ['var(--theme-background)', 'var(--theme-accent)']
const theme = { light: themeFromColorscheme, dark: themeFromColorscheme }

export default function ReactGithubCalendar({ username }: { username: string }) {
  return (
    <div className="github-calendar my-6">
      <GitHubCalendar username={username} theme={theme} />
    </div>
  )
}
