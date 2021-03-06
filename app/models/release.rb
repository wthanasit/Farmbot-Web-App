require "open-uri"
require "google/cloud/storage"

class Release < ApplicationRecord
  CHANNEL = [BETA = "beta", STABLE = "stable"]
  GITHUB_URL = "https://api.github.com/repos/farmbot/farmbot_os/releases/latest"
  PLATFORMS = [GENESIS = "rpi3", EXPRESS = "rpi"]
  # Version string, as it appears in Github.
  VERSION_INPUT_FORMAT = /v\d*\.\d*\.\d*(\-rc\d*)?/
  # Version string, as it appears in our database.
  VERSION_STORAGE_FORMAT = /\d*\.\d*\.\d*(\-rc\d*)?/
  before_update :readonly!

  validates_inclusion_of :channel, in: CHANNEL
  validates_inclusion_of :platform, in: PLATFORMS
  validates :version, presence: true, format: { with: VERSION_STORAGE_FORMAT }
  validates :image_url, presence: true

  def self.transload(url, gcs = Google::Cloud::Storage.new)
    file_name = url.split("/").last
    tempdir = "#{Rails.root.join("tmp").to_s}/#{file_name}"
    download = URI.open(url)
    IO.copy_stream(download, tempdir)
    bucket = gcs.bucket(ENV.fetch("GCS_BUCKET"))
    file = bucket.upload_file tempdir, "releases/#{file_name}"
    return file.url
  end

  def self.maybe_find_latest(query)
    Release.order(created_at: :desc).find_by(query)
  end
end
