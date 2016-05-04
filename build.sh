echo "Are you sure you are ready to build and deploy? (yes [y]/no [n])"
read str
if [ $str == 'yes' ] || [ $str == 'y' ] ; then
  DEPLOY_HOSTNAME=galaxy.meteor.com MONGO_URL=mongodb://it2901:it2901@ds013951.mlab.com:13951/it2901 meteor deploy --settings settings.json it2901.jahren.it
  echo build and deploy finished
else
  echo build and deploy interrupted
fi
