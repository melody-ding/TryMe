//
//  ViewController.swift
//  VideoUploader
//
//  Created by Melody Ding on 10/26/19.
//  Copyright © 2019 Melody Ding. All rights reserved.
//

import UIKit
import AVKit
import AVFoundation
import Alamofire

class ViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    let imagePickerController = UIImagePickerController()
    var videoURL: NSURL?

    @IBOutlet weak var imageView: UIImageView!

    @IBAction func uploadVideo(_ sender: UIBarButtonItem) {
        imagePickerController.sourceType = .photoLibrary
        imagePickerController.delegate = self
        imagePickerController.mediaTypes = ["public.image", "public.movie"]
        
        present(imagePickerController, animated: true, completion: nil)
        
    }
    
    func uploadVideo(videoUrl: URL) { // local video file path..
        let timestamp = NSDate().timeIntervalSince1970 // just for some random name.
        
        let endpoint = "https://b55e5736.ngrok.io"
        
        // figure out if this is a post request or a get request. 
        // how to access this multipart content in your node server
        // download file to the computer and then upload that to eluv.io
        // takethe parameter ocntent and throw it into eluv.io
        AF.upload(multipartFormData: { (multipartFormData) in
            multipartFormData.append(videoUrl, withName: "image", fileName: "\(timestamp).mp4", mimeType: "\(timestamp)/mp4")
        }, to: endpoint  ).responseJSON { (response) in
            print(response)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    func previewImageFromVideo(url:NSURL) -> UIImage? {
        let asset = AVAsset(url:url as URL)
        let imageGenerator = AVAssetImageGenerator(asset:asset)
        imageGenerator.appliesPreferredTrackTransform = true
        
        var time = asset.duration
        time.value = min(time.value,2)
        
        do {
            let imageRef = try imageGenerator.copyCGImage(at: time, actualTime: nil)
            return UIImage(cgImage: imageRef)
        } catch {
            print("Here:")
            return nil
        }
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        
        videoURL = info["UIImagePickerControllerReferenceURL"] as? NSURL
        
        let image = info["UIImagePickerControllerOriginalImage"] as? UIImage
        
        print(videoURL)
        
        if let videoURL = videoURL {
            if let previewImage = previewImageFromVideo(url: videoURL) {
                imageView.image = previewImage
                
            } else {
                print("No image!")
            }
        }

        imageView.contentMode = .scaleAspectFit
        
        imagePickerController.dismiss(animated: true, completion: nil)
        
        
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        imagePickerController.dismiss(animated: true, completion: nil)
    }
    
    @IBAction func videoTapped(sender: UITapGestureRecognizer) {
        
        print("button tapped")
        
        if let videoURL = videoURL{
            
            let player = AVPlayer(url: videoURL as URL)
            
            let playerViewController = AVPlayerViewController()
            playerViewController.player = player
            
            present(playerViewController, animated: true){
                playerViewController.player!.play()
            }
        }
    }
    
}
