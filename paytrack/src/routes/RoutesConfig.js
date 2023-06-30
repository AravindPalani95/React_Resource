import Bucket from "../components/buckets/Bucket"
import Dashboard from "../components/dashboard/Dashboard"
import Notifications from "../components/notifications/Notifications"
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
        sidebarName: 'DASHBOARD',
        component: DashboardPage 

    },
    {
        path: '/reports',
        sidebarName: 'REPORTS',
        component: ReportsPage 

    },
    {
        path: '/notifications',
        sidebarName: 'NOTIFICATIONS',
        component: NotificationsPage
    },
    {
        path: '/paymentbucket',
        sidebarName: 'PAYMENT BUCKET',
        component: PaymentBucket
    },
    {
        path: '/',
        redirectPath: '/dashboard'
    }
]

export default RoutesConfig