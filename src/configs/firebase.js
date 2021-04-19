const admin = require("firebase-admin")
const firebaseConfig = {
    "type": "service_account",
    "project_id": "social-clonne",
    "private_key_id": "a6611081efb3fc5904d053648021eb70b65e05d4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPg+KfjE4GDQQv\nB8/DZpfQNjrL1rN5U/ol54sKbjaJQ59000gO0NWylcchPMfzunmNPrT3hL02wC8k\n8JbmP3vsrY3mIWqYrbPaA8f+KQawbVoFHwhOOfWkt6jg42AIW9YvB/ChSW1EECiP\nhLChqDiatjgo+petbTuXdCmSrAhjoruZNUaVlyCdvCYc4Rvcz0a/26l3/Ku55koA\nrktZ5m+LaziIyOYRFsdTKWG/V45zvYsFqw23Frlj1h0dKHL06xc4Exj7B+7XENn/\nW184poU4QkKkycbKs2oewu9hDbmR4GQ0acZr5Fwc9nn7mm7hPvqepe5y8H0qiBvH\nZubQWalBAgMBAAECggEAA79wZzyF17jiNZW86Dzo+sER+oa6BtPQEaFvCs0PBddf\ncMEUnPTjWSZ4mlZyT4nzgkwqwUonzy51I4QHW6jznGSNiqWZmuCPPh2hnerghKzy\n6mMDN8N29ua8wXQF0tzSv1Zzv3v3odovW1k0hfTncc7e8ImHFgIiKIP38L7T53W7\nenrXhPxbq8UwuTm/J8Vf0j7oqAaR48YCLEsAY2F9fLXaqktwjSBW6Bx4O8iwUuDx\nyRkdE+nqVJSLdQiQpR5YUXXfQioVZgFj152Mz8DO9InbGyumyrDDeWKFop2R0mdv\nkNjleuycUz8nHl12k/aWZdjwCDcfhJrCKSnGVR+n4QKBgQDzOR9CE6J3Fr79EhRB\nT/Xmzxh1CHzJiCJPeoY/WKftep9JVP5lU9ehwo/8d98zj4eNEiLccoTnj6wtAnVB\nhAkIarZO8VG470//gYyqpNUZCHxehY3WC5u9sQX6Hr8OLUxLYJZih3dghB4H9Qk4\nGdsE7O6GBlNJJ/vuIXXZdMhdcQKBgQDaao+EBIl8fDtRBNvbcEQeTJRmfhqZebqw\nn+kfeAmumpqz07X9OU9AuB/8PsEjex6f8HjFar7O4gGJ5JHmmAF1tvZ+Rrz7n9SR\nfoGyYEMkrv1BeF5rQHkME1T5jhIfkgz6yKQkbKpajMPtcHKtE1MenPYu/qBzd6IL\n+pOy/+tg0QKBgQCBb8vHwWU7lTpMuZtX6rLFgz7TwZGPOshvnZfmDEtJ4XD1eKrt\nx8HAjydLR4vcB60ukRFGWheKl/Yb+evm0tpvxUKCHoDMN2dOZWYzxga2DMMLFm4W\nFBVszNGOe2BXrhmlH6DIjKkmDwlgWLHwTio1o9WIM8OM8h9rahkqgbDDsQKBgBvt\nnERJQDtGt174vBQnGs61BBTG8yfExPZovCpl8vb8leOAoriqZ1PjN1PNwmyDBbt1\nyDuWFqflhkTXkUBnF2ix6HrlGK0kFs4z2umwHWXHamLAvXIBYHkGz8rJO9AFoNtA\nZJyzuGSzsyndQwyWd/5mG6SOsn2RQos9kz1ENBjBAoGAEZzLD0bSJYi8/D8YuNtv\nUJFJThOwdj5MyhFoP8Cpbv2bgdhtOOy8z6mpc+qrIGtQg3f6bQYr1ARdwgN0Qgm9\ncrm0JhtkMbQrI4Cgk3pT2Ja+isWcprzW7BjLdYUR2AqWQ99nkcYXA8zGSgVQq34a\n7Ns/y++jqStUW7Y36ebknaE=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-uhvhx@social-clonne.iam.gserviceaccount.com",
    "client_id": "110477735923720353963",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uhvhx%40social-clonne.iam.gserviceaccount.com"
  }
  
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    storageBucket: "social-clonne.appspot.com"
})

const bucket = admin.storage().bucket()
const storage = admin.storage()

module.exports = {bucket, storage}