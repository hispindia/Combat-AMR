import i18n from '@dhis2/d2-i18n'
import { Divider, Menu, MenuItem } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import {
    DataIcon,
    TasksIcon,
} from '../index'
import { ImportMenuSectionHeader } from './ImportMenuSectionHeader'
import styles from './Sidebar.module.css'

const dataImportPage = {
    name: i18n.t('Data import'),
    code: 'data-import',
    icon: <DataIcon />,
    path: '/import/data',
}

const importPages = [
    dataImportPage
]


const jobOverviewPage = {
    name: i18n.t('Job overview'),
    code: 'job-overview',
    path: '/utils/job-overview',
    icon: <TasksIcon />,
}

const SidebarItem = ({ name, path, code, active, className }) => {
    const history = useHistory()
    const navigateToPath = () => history.push(path)
    const href = history.createHref({
        pathname: path,
        search: '',
        hash: '',
    })

    return (
        <MenuItem
            active={active}
            href={href}
            onClick={navigateToPath}
            label={name}
            className={cx(className, {
                [styles.sidebarItem]: !active,
                [styles.sidebarItemActive]: active,
            })}
            dataTest={`sidebar-link-${code}`}
        />
    )
}

SidebarItem.propTypes = {
    active: PropTypes.bool.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    className: PropTypes.string,
}

const Sidebar = () => {
    const location = useLocation()
    const pathname = location.pathname

    return (
        <Menu className={styles.Menu}>
            <SidebarItem
                name={i18n.t('Overview')}
                path={'/'}
                code={'home'}
                active={pathname == '/'}
            />
            <ImportMenuSectionHeader />
            {importPages.map(({ icon, name, code, path }) => {
                const active = pathname == path
                return (
                    <SidebarItem
                        name={name}
                        path={path}
                        code={code}
                        icon={icon}
                        active={active}
                        key={path}
                    />
                )
            })}
            
            <Divider />
            <SidebarItem
                name={jobOverviewPage.name}
                path={jobOverviewPage.path}
                code={jobOverviewPage.code}
                icon={jobOverviewPage.icon}
                active={pathname == jobOverviewPage.path}
                className={
                    pathname == jobOverviewPage.path ? '' : styles.jobOverview
                }
                key={jobOverviewPage.path}
            />
        </Menu>
    )
}

export { Sidebar }
