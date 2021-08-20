import React from 'react'
import PropTypes from 'prop-types'
import Dashboard from '../Dashboard'
import Footer from './components/Footer'
import Header from './components/Header'
import { TextField } from '@material-ui/core'

const App = props => {
  return (
    <>
      <Header><TextField placeholder="search"/></Header>
      <Dashboard />
      <Footer />
    </>
  )
}

App.propTypes = {

}

export default App
