var React = require("react");

var Persona = React.createClass({
  getInitialState: function() {
    return {};
  },
  getMotivators: function () {
    var personaMotivators = this.props.motivators.split(',');
    var motivatorList = [];
    ['Attention', 'Community', 'Ambition', 'Self Expression'].forEach(function (m){
      motivatorList.push(<li className={(personaMotivators.indexOf(m) > -1) ? 'on' : ''}>{m}</li>);
    });
    return motivatorList;
  },
  render: function() {
    return (
      <div>
        <div className="info-box">
            <h3>{this.props.name}</h3>
            <ul className="traits">
                <li>{this.props.location}</li>
                <li>{this.props.occupation}</li>
            </ul>
            <ul className="motivators">
              {this.getMotivators()}
            </ul>
        </div>
        {this.props.children}
      </div>
    );
  }
});

var Audience = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header">
          <h2>Our Audience</h2>
        </div>
        <div className="main">
          <div id="audience">
              <h2 className="clearfix">Motivators</h2>
              <section className="motivators">
                  <div className="subsection">There are principal motivators behind any product that people know and love, through which interest and ingenuity are retained. Webmaker hopes to ingnite these motivations to promote making and learning on the open, and increasingly mobile web.</div>
                  <div className="subsection grid">
                      <div className="row-2">
                          <div className="col attention">
                              <h3>Attention</h3>
                              <p>Passion for interacting with an audience.</p>
                          </div>
                          <div className="col community">
                              <h3>Community</h3>
                              <p>Feeling of connection and organization with peers, friends, and acquaintances. </p>
                          </div>
                      </div>
                      <div className="row-2">
                          <div className="col self-expression">
                              <h3>Self Expression</h3>
                              <p>Ability to share and communicate knowledge, questions, and creativity with other people.</p>
                          </div>
                          <div className="col aspiration">
                              <h3>Ambition</h3>
                              <p>Desire to achieve personal growth.</p>
                          </div>
                      </div>
                  </div>
              </section>
              <h2 className="clearfix">Personas</h2>
              <section className="personas">
                  <div className="subsection">To better understand Webmaker’s audience, we conducted interviews, research and analysis of real users’ motivations and struggles. Real-life users are complex and always changing, but these personas will more easily let us enter the headspace of our users who are potentially very different from us. And as we contemplate pathways through Webmaker that meet various needs, we can refer to our users by name.</div>
                  <div className="subsection bare grid">
                      <div className="row-2">
                          <div className="col jane">
                            <Persona name="Jane" location="Kenya" occupation="Entrepreneur" motivators="Ambition,Attention">
                              <p>Situated on the outskirts of Kisumu, Kenya, Jane is an entrepreneur whose new rabbit farm will give her a more stable lifestyle than her old potato distribution business.</p>
                              <p className="quote">I learned about technology and farming from the Internet.</p>
                              <p>Jane is an avid Facebook user, which let her learn the skills she needed to start her farm, and will allow her to promote and conduct business in the future.</p>
                              <p>As a member of the Equity Group Foundation’s “Improve Your Business” program, her dream is to grow her new business and see it flourish.</p>
                              <p>Eventually, Jane hopes to buy a smart-phone to replace her current feature-phone. She wants to use Webmaker not only to learn about creating an online presence, but to reach her clients, many of whom connect with each other primarily through mobile devices.</p>
                            </Persona>
                          </div>
                          <div className="col lewis">
                            <Persona name="Lewis" location="Kenya" occupation="Teacher, Artist" motivators="Community,Ambition,Attention,Self Expression">
                              <p>Lewis is an artist living on the outskirts of Kisumu, Kenya. He studies health and community at the university nearby, and works as a spoken word artist by speaking at weddings and funerals. Currently, he is authoring his first book, but regularly practices his writing by posting quotes on his popular Facebook account.</p>
                              <p className="quote">Every morning, I wake up wondering what I can change.</p>
                              <p>With the feature phone he calls his “Walkie Talkie”, Lewis reaches people through his Facebook page, which is also his promotion platform and a method for finding work.</p>
                              <p>Lewis wants to change the world, and help the children in his community. He sees Webmaker as an opportunity for reaching people and earning money, since it allows people to create content for themselves.</p>
                            </Persona>
                          </div>
                      </div>
                      <div className="row-2">
                          <div className="col sadia">
                            <Persona name="Sadia" location="Bangladesh" occupation="Student" motivators="Attention,Self Expression">
                              <p>Like many Bangladeshi girls her age, Sadia is determined to succeed in school. Her goals are set high, with heroes ranking among influential Bangladeshi bankers, entrepreneurs, and actresses.</p>
                              <p className="quote">I love to gossip with my friends about my favourite TV shows.</p>
                              <p>Her Internet usage is restricted by her parents, who want her to focus on her studies. However, her parents’ unfamiliarity with Facebook affords her some privacy, where she chats with her friends about the her favourite movies and TV shows -- when she is done her homework, of course!</p>
                              <p>Hoping to own one day a smart-phone with a powerful camera, Sadia would continue to share pictures, garnering likes and comments from her friends. Enthusiastic about Webmaker, she wants to continue to express herself through it while learning about opportunities on the Internet outside of Facebook.</p>
                            </Persona>
                          </div>
                          <div className="col kevin">
                            <Persona name="Kevin" location="USA" occupation="Student" motivators="Community,Ambition">
                              <p>Currently a university sophomore, Kevin grew up in "East Side" Chicago, a.k.a. Alphabetland, where he attended high school. There, he learned to jailbreak and customize his own phones.</p>
                              <p>After hearing about his high school robotics team, he quickly joined, became captain, and led the team to the MATE Underwater Robotics competition.</p>
                              <p>Kevin continued to enjoy tinkering with technology through an internship at the Adler Planetarium where he spent time writing and modifying Arduino scripts to control robot motors.</p>
                              <p>Although he is a busy university student, Kevin still spends time mentoring and volunteering at the planeterium.</p>
                            </Persona>
                          </div>
                      </div>
                      <div className="row-2">
                          <div className="col lajune">
                            <Persona name="LaJune" location="USA" occupation="Student" motivators="Ambition,Self Expression">
                              <p>LaJune mixes her love for fashion, art and technology as a student of NYU Polytechnic School of Engineering’s Integrated Digital Media Program.</p>
                              <p>She loves exploring and experimenting with different mediums of art. She is a craft connoisseur, always excited about a new DIY project she can recreate. LaJune is active on social media, and shares her creations as a way to communicate with others.</p>
                              <p>Hoping to reflect her knowledge and passion on others, she participates as a volunteer and mentor in many Hive and Maker Party events.</p>
                            </Persona>
                          </div>
                          <div className="col kathryn">
                            <Persona name="Kathryn" location="Canada" occupation="Teacher, Coder" motivators="Attention,Community,Ambition,Self Expression">
                              <p>Now heading-up Toronto’s Ladies Learning Code chapter, Kathryn hosts workshops for kids using Webmaker tools, like Thimble and X-Ray Goggles, and is routinely involved in Mozilla community events.</p>
                              <p>Learning to code at a young age, she has since focused her passions for education and technology toward younger kids by showing them not only how to code, but to build interesting, shareable, open content on the web.</p>
                            </Persona>
                          </div>
                      </div>
                  </div>
              </section>
              <h2 className="clearfix">Journey</h2>
              <section className="journey">
                  <div className="subsection">To identify and understand our audience, we have been developing a hierarchy based on usage and engagement with technology, the Internet, and the web. As it evolves, and as we learn more about our audience, we will be able to craft better activities and modeling techniques to connect with people as they become better learners, makers, and users of the web.</div>
                  <div className="subsection">
                      <a href="/img/personas/user-journey.jpg"><img src="/img/personas/user-journey.jpg"/></a>
                  </div>
              </section>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Audience;
