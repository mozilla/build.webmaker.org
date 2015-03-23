var React = require("react");
var { AuthMixin } = require("./auth.jsx");
var GitHubPersonChooser = require("./GitHubPersonChooser.jsx");

var Add = React.createClass({
  mixins: [AuthMixin],
  render: function() {
    var body = (
      <div>
        <a className="button" onClick={this.login}>Login with Github</a>
        <p>To create new projects you need to be logged-in to your Github account.</p>
        <div className="pagefill"/>
      </div>
    );
    if (this.state.loggedIn) {
      body = (
        <div id="add">
          <form method="POST" action="/api/add">
            <div className="question">
              <h2>Give your project a title.</h2>
              <p>In as few words as possible, describe what this project is about.</p>
              <textarea name="title" rows="2"></textarea>
            </div>

            <div className="question">
              <h2>What is the problem you are trying to solve?</h2>
              <p>Describe what’s broken or missing from the current experience.</p>
              <textarea name="problem" rows="5"></textarea>
            </div>

            <div className="question">
              <h2>Who are the users you are trying to impact?</h2>
              <p>Describe who is being affected by the problem you have described (visitors, teachers, staff, community).</p>
              <textarea name="audience" rows="5"></textarea>
            </div>

            <div className="question">
              <h2>What does success look like?</h2>
              <p>Describe the "state change" that you wish to accomplish. Do you have metrics that we can reference?</p>
              <textarea name="success" rows="5"></textarea>
            </div>

            <div className="question">
              <h2>What is your vision for a solution?</h2>
              <p>Describe a high level solution to solve the problem. Think about the most important, impactful part of the solution.</p>
              <textarea name="vision" rows="5"></textarea>
            </div>

            <div className="question">
              <h2>How will you measure success?</h2>
              <p>Describe the data you will use. Is there existing tracking in place? Do you need to setup new reports or dashboards?</p>
              <textarea name="measurement" rows="5"></textarea>
            </div>
            <div className="question">
              <h2>Decision Maker</h2>
              <p>Who is the single person who can be relied upon to make the decisions that will come up during this initiative?</p>
              <GitHubPersonChooser name="decision" team="MoFos"/>
            </div>
            <div className="question">
              <h2>Driver (optional)</h2>
              <p>If known, who is the single person who will drive this initiative for the heartbeat?</p>
              <GitHubPersonChooser name="driver" team="trained drivers"/>
            </div>
            <button className="button" type="submit">Submit Project</button>
          </form>
        </div>
      );
    }

    return (
      <div>
        <div className="header">
          <h2>New Initiative</h2>
        </div>
        <div className="main">
          {body}
        </div>
      </div>
    );
  }
});
module.exports = Add;
