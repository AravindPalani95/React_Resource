import Bucket from "../components/buckets/Bucket"
import Dashboard from "../components/dashboard/Dashboard"
import Notifications from "../components/notifications/Notifications"
import Reports from "../components/reports/Reports"
import ReportPageV1 from "../components/reports/ReportsV1"

const DashboardPage = () =>{
    return(
       <Dashboard/>
    )
}

const ReportsPage = () =>{
    return(
        <ReportPageV1/>
    )
}

const NotificationsPage = () =>{
    return(
        <Notifications/>
    )
}

const PaymentBucket = () =>{
    return (
        <Bucket/>
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
        path: '/paymentbucket',
        sidebarName: 'Payment Bucket',
        component: PaymentBucket
    },
    {
        path: '/',
        redirectPath: '/dashboard'
    }
]

export default RoutesConfig