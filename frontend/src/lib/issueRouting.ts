export interface RoutableIssue {
  id: string
  slug?: string | null
  issueNumber: number
  title?: string | null
}

export const isSpecialIssue = (issue: RoutableIssue): boolean =>
  issue.issueNumber <= 0 ||
  (issue.slug || '').toLowerCase().includes('special') ||
  (issue.title || '').toLowerCase().includes('special')

export const getIssueRouteId = (issue: RoutableIssue): string => {
  const slug = issue.slug?.trim()

  if (slug) {
    return slug
  }

  if (isSpecialIssue(issue)) {
    return 'special'
  }

  return String(issue.issueNumber).padStart(2, '0')
}

export const getIssueDisplayLabel = (issue: RoutableIssue): string => {
  if (isSpecialIssue(issue)) {
    return 'Special Issue'
  }

  return `Issue ${String(issue.issueNumber).padStart(2, '0')}`
}

export const sortIssuesByNewest = <T extends RoutableIssue>(issues: T[]): T[] =>
  [...issues].sort((a, b) => {
    const aSpecial = isSpecialIssue(a)
    const bSpecial = isSpecialIssue(b)

    if (aSpecial !== bSpecial) {
      return aSpecial ? 1 : -1
    }

    return b.issueNumber - a.issueNumber
  })

export const matchIssueByRouteId = <T extends RoutableIssue>(issues: T[], routeId: string): T | undefined => {
  const normalizedRoute = routeId.trim().toLowerCase()

  if (!normalizedRoute) {
    return sortIssuesByNewest(issues).find((issue) => !isSpecialIssue(issue)) || sortIssuesByNewest(issues)[0]
  }

  return issues.find((issue) => {
    const slugMatch = issue.slug?.toLowerCase() === normalizedRoute
    const idMatch = issue.id?.toLowerCase() === normalizedRoute
    const raw = String(issue.issueNumber)
    const padded = issue.issueNumber > 0 ? String(issue.issueNumber).padStart(2, '0') : raw
    const numberMatch = normalizedRoute === raw || normalizedRoute === padded
    const specialMatch = isSpecialIssue(issue) && normalizedRoute === 'special'

    return slugMatch || idMatch || numberMatch || specialMatch
  })
}
