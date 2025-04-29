import { Link } from '@tanstack/react-router'

function LinkMark({ to = '/', children }: { to?: string; children: React.ReactNode }) {
    return (
        <Link
            to={to}
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
            {children}
        </Link>
    )
}

export default LinkMark
