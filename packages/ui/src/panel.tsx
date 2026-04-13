import type { CSSProperties } from 'react'

type PanelProps = {
  title: string
  description: string
}

const panelStyle: CSSProperties = {
  borderRadius: 24,
  border: '1px solid rgba(148, 163, 184, 0.3)',
  background: 'rgba(255, 255, 255, 0.8)',
  padding: 24,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
}

export function Panel({ title, description }: PanelProps) {
  return (
    <article style={panelStyle}>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>{title}</h2>
      <p style={{ color: '#475569', lineHeight: 1.6 }}>{description}</p>
    </article>
  )
}
