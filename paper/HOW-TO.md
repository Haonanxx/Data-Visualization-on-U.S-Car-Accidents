# Paper

Write the paper in Overleaf:

- Register on [Overleaf](https://www.overleaf.com/register)
- Create paper and share it:
  - Go to [Overleaf](https://www.overleaf.com/register)
  - Click `New Project` and `Upload Project`
  - Upload `LNCS-Template.zip`
  - Click ✎ icon next to the title at the top of the page and rename with your project name
  - Click `Share` to share within your team
  - In the <code>Share Project</code> panel click <code>Turn on link sharing</code> and use the <q>Anyone with this link can view this project</q>


Here is how the pr
- Click `New Project` >  `View All` in <a href="https://www.overleaf.com/project">Overleaf</a> and
                      search for <q>Lecture Notes in Computer Science</q>.
                      Choose <q>Springer Lecture Notes in Computer Science</q> and <code>Open as Template</code>.
                    </li>
                    <li></li>
                    <li>Click Share and share with your team members</li>

                    <li>Use bibtex references:
                      <ul>
                        <li>Open <code>samplepaper.tex</code> and uncomment the two lines (latex comments start with a %):
                          <pre><code class="text" data-trim data-noescape>
                              % \bibliographystyle{splncs04}
                              % \bibliography{mybibliography}
                          </code></pre>
                        </li>
                        <li>Remove the block:
                          <pre><code class="latex" data-trim data-noescape>
                            \begin{thebibliography}{8}
                            ...
                            \end{thebibliography}
                          </code></pre>
                        </li>
                        <li>Create <code>mybibliography.bib</code> and add a reference, e.g.:
                          <pre><code class="latex" data-trim data-noescape>
                              %from Google scholar
                              @misc{bostock2014data,
                                title={Data-Driven Documents-D3. js},
                                author={Bostock, Mike},
                                year={2014}
                              }
                              
                              %from Google scholar
                              @book{wickham2016ggplot2,
                                title={ggplot2: elegant graphics for data analysis},
                                author={Wickham, Hadley},
                                year={2016},
                                publisher={Springer}
                              }
                              
                              %using a URL
                              @misc{d3_url,
                                  title = {d3js},
                                  howpublished = "\url{http://d3js.org}",
                                  year = {2019},
                                  key = {d3_url},
                                  note = "[Online; Accessed 10-November-2019]"
                              }                          </code></pre>
                          Remove errors replacing all the citations in <code>samplepaper.tex</code>, e.g., <code>bostock2014data</code>.
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <cap style="position: absolute; bottom: 0px; right: 0px">11 of 11</cap>
              </section>