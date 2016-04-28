echo "Are you sure you are ready to build and deploy? (yes [y]/no [n])"
read str
if [ $str == 'yes' ] || [ $str == 'y' ] ; then
  DEPLOY_HOSTNAME=galaxy.meteor.com meteor deploy --settings settings.json it2901.jahren.it
  echo build and deploy finished
else
  echo build and deploy interrupted
fi
