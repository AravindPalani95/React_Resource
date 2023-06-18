import Dashboard from "../components/dashboard/Dashboard"

const DashboardPage = () =>{
    return(
       <Dashboard/>
    )
}

const ReportsPage = () =>{
    return(
        <h1>Reports</h1>
    )
}

const NotificationsPage = () =>{
    return(
        <h1>Notification</h1>
    )
}

const RoutesConfig = [
    {
        path: '/dashboard',
        sidebarName: 'Dashboard',
        component: DashboardPage 

    },
    {
        path: '/reports',
        sidebarName: 'Reports',
        component: ReportsPage 

    },
    {
        path: '/notifications',
        sidebarName: 'Notifications',
        component: NotificationsPage
    },
    {
        path: '/',
        redirectPath: '/dashboard'
    }
]

export default RoutesConfig