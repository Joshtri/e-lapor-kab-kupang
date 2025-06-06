"use client"

import DashboardPelapor from "@/components/pelapor/DashboardPelapor"
import { useIsMobile } from "@/hooks/use-media-query"
// import DashboardPelaporDesktop from "@/components/pelapor/dashboard/"
import DashboardPelaporMobile from "@/components/pelapor/dashboard/DashboardPelaporMobile"
import PropTypes from 'prop-types'

const DashboardPelaporGrid = ({ user }) => {
    const isMobile = useIsMobile()

    // Show mobile version for screens smaller than 768px
    if (isMobile) {
        return <DashboardPelaporMobile user={user} />
    }

    // Show desktop version for larger screens
    // return <DashboardPelaporDesktop user={user} />
    return <DashboardPelapor user={user} />
}
DashboardPelaporGrid.propTypes = {
    user: PropTypes.object.isRequired
}

export default DashboardPelaporGrid;
 