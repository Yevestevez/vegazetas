const FORMATTER = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' })

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)

    return FORMATTER.format(date)
}

export default formatDate
