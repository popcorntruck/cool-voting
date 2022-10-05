use std::{
    io::{self, BufRead},
    sync::Arc,
    time::Duration,
};

use rand::Rng;

#[tokio::main]
async fn main() {
    let stdin = io::stdin();
    println!("What is the poll id?");

    let poll_id = stdin
        .lock()
        .lines()
        .next()
        .expect("there was no next line")
        .expect("the line could not be read");

    println!("What poll's number of questions?");

    let poll_num_questions = stdin
        .lock()
        .lines()
        .next()
        .expect("there was no next line")
        .expect("the line could not be read")
        .parse::<i32>()
        .unwrap();

        println!("Whats the vote interval?");

    let poll_vote_interval = stdin
        .lock()
        .lines()
        .next()
        .expect("there was no next line")
        .expect("the line could not be read")
        .parse::<u64>()
        .unwrap();

    let mut send_vote_interval = tokio::time::interval(Duration::from_millis(poll_vote_interval));

    let http_client = reqwest::Client::new();

    tokio::spawn(async move {
        loop {
            send_vote_interval.tick().await;

            let option_to_vote = rand::thread_rng().gen_range(1..poll_num_questions + 1);

            tokio::spawn(
                http_client
                    .post("http://localhost:3000/api/trpc/poll.vote")
                    .json(&serde_json::json!({
                        "json": {
                            "pollId": poll_id,
                            "choice": option_to_vote
                        }
                    }))
                    .send(),
            );
        }
    });

    tokio::signal::ctrl_c().await.unwrap();
}
