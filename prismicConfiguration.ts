// -- Prismic Repo Name
export const repoName = 'challenge-5---ignite'

// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = `https://${repoName}.cdn.prismic.io/api/v2`

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
export const accessToken = 'MC5ZYnRvbkJVQUFDMEFyM3VG.77-977-977-9fe-_vVt8fe-_ve-_vWnvv71nbC3vv73vv70jYH0wde-_vUjvv73vv73vv73vv73vv73vv70EJQ'

// -- Link resolution rules
// Manages the url links to internal Prismic documents
export const linkResolver = (doc) => {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`
  }
  return '/'
}

// -- Route Resolver rules
// Manages the url links to internal Prismic documents two levels deep (optionals)
export const Router = {
  routes: [
    {
      "type":"posts",
      "path":"/:uid"
    },
  ]
};