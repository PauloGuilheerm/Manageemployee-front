export function formatDate(value?: string | number | Date): string {
    if (!value) return ''
    const d = new Date(value)
    if (isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(d)
}


