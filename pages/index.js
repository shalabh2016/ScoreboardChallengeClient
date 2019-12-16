import React from 'react'
import Layout from '../components/layout'
import PlayerPointComponent from '../components/playerpoint.component'

const Index = () => {

  return (
    <Layout title="Welcome to Scoreboard Challenge">
      <main role="main">
        <div className="container">
          <h1>Scoreboard Challenge</h1>
          <div className="row">
            <div className="col">
            <PlayerPointComponent/>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
export default Index