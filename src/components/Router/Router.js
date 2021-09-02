import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import {
    DataImport,
    DataExport,
    JobOverview,
    Home,
} from '../../pages'
import { ScrollToTop } from '../Router/ScrollToTop'

const Router = () => {
    return (
        <ScrollToTop>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/import/data" component={DataImport} />
                <Route path="/export/data" component={DataExport} />
                <Route path="/utils/job-overview" component={JobOverview} />
                <Redirect from="*" to="/" />
            </Switch>
        </ScrollToTop>
    )
}

export { Router }
